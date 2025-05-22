import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

// --- Schemas --- (Using Zod for validation)

const UserRoleEnum = z.enum(['admin', 'editor', 'viewer'], {
	message: 'Invalid user role. Must be admin, editor, or viewer.'
});

const CreateUserSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }).max(100).optional(),
	email: z.string().email({ message: 'Invalid email address' }).max(255),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(255),
	role: UserRoleEnum
});

const UpdateUserSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().max(255),
	password: z.string().min(8).max(255).optional(),
	role: UserRoleEnum
});

// --- Actions --- (Interacting with D1)

export const users = {
	// --- CREATE --- //
	createUser: defineAction({
		accept: 'form',
		input: CreateUserSchema,
		handler: async (
			input: z.infer<typeof CreateUserSchema>,
			context: ActionAPIContext
		) => {
			const { name, email, password, role } = input;
			const db = context.locals.runtime.env.DB;
			const passwordHash = await bcrypt.hash(password, 12);

			try {
				// Get role_id from roles table
				const roleRecord = await db.prepare('SELECT id FROM roles WHERE name = ?').bind(role).first<{ id: number }>();
				if (!roleRecord) {
					return { success: false, message: `Role '${role}' not found.` };
				}
				const roleId = roleRecord.id;

				// Use D1 batch for atomic operations
				const batchResult = await db.batch([
					db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').bind(email, passwordHash, name || null),
					// Placeholder for user_id, will be replaced by logic to get last insert id if D1 batch supports it,
					// otherwise, this needs to be a two-step process or a more complex batch setup.
					// For now, assuming we need to get user_id first if batch doesn't return it directly for the next statement.
					// This direct batch approach won't work for user_roles if user_id is auto-incremented.
				]);

				// D1 batch doesn't easily return last insert ID for use in subsequent statements within the same batch.
				// So, we do it in two steps:
				const userInsertResult = await db.prepare(
						'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
					)
					.bind(email, passwordHash, name || null)
					.run();

				if (!userInsertResult.success || !userInsertResult.meta || userInsertResult.meta.last_row_id === undefined) {
					console.error("Failed to insert user or get last_row_id:", userInsertResult);
					return { success: false, message: 'Failed to create user record.' };
				}
				const userId = userInsertResult.meta.last_row_id;

				const userRoleResult = await db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)')
					.bind(userId, roleId)
					.run();

				if (!userRoleResult.success) {
					console.error("Failed to assign role to user:", userRoleResult);
					// Potentially attempt to delete the created user if role assignment fails (rollback logic)
					await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
					return { success: false, message: 'Failed to assign role to user.' };
				}

				console.log(`User created with ID: ${userId} and Role ID: ${roleId}`);
				return { success: true, message: 'User created successfully.' };

			} catch (error: any) {
				console.error("Error creating user:", error);
				if (error.message?.includes('UNIQUE constraint failed: users.email')) {
					return { success: false, message: 'Email already exists.' };
				}
				if (error.message?.includes('UNIQUE constraint failed: user_roles.user_id')) { // Should not happen with new user
					return { success: false, message: 'User already has a role assigned (unexpected error).' };
				}
				return { success: false, message: 'Failed to create user.' };
			}
		}
	}),

	// --- READ (All) --- //
	listUsers: defineAction({
		handler: async (_, context: ActionAPIContext) => {
			const db = context.locals.runtime.env.DB;
			try {
				const { results } = await db.prepare(
					`SELECT u.id, u.email, u.name, r.name as role, u.created_at, u.updated_at 
					 FROM users u 
					 LEFT JOIN user_roles ur ON u.id = ur.user_id 
					 LEFT JOIN roles r ON ur.role_id = r.id
					 ORDER BY u.name ASC` // Optional: order by name or created_at
				).all();
				return { success: true, users: results };
			} catch (error) {
				console.error("Error listing users:", error);
				return { success: false, message: 'Failed to fetch users.', users: [] };
			}
		}
	}),

	// --- READ (Single by ID) --- //
	getUserById: defineAction({
		input: z.object({ id: z.number().int().positive() }),
		handler: async (
			input: { id: number },
			context: ActionAPIContext
		) => {
			const { id } = input;
			const db = context.locals.runtime.env.DB;
			try {
				const user = await db.prepare(
					`SELECT u.id, u.email, u.name, r.name as role, u.created_at, u.updated_at 
					 FROM users u 
					 LEFT JOIN user_roles ur ON u.id = ur.user_id 
					 LEFT JOIN roles r ON ur.role_id = r.id 
					 WHERE u.id = ?`
				)
				.bind(id)
				.first();

				if (!user) {
					return { success: false, message: 'User not found.', user: null };
				}
				return { success: true, user };
			} catch (error) {
				console.error(`Error fetching user ${id}:`, error);
				return { success: false, message: 'Failed to fetch user.', user: null };
			}
		}
	}),

	// --- UPDATE --- //
	updateUser: defineAction({
		accept: 'form',
		input: UpdateUserSchema,
		handler: async (
			input: z.infer<typeof UpdateUserSchema>,
			context: ActionAPIContext
		) => {
			const { id: userId, name, email, password, role } = input;
			const db = context.locals.runtime.env.DB;
			
			try {
				// Get role_id from roles table
				const roleRecord = await db.prepare('SELECT id FROM roles WHERE name = ?').bind(role).first<{ id: number }>();
				if (!roleRecord) {
					return { success: false, message: `Role '${role}' not found.` };
				}
				const newRoleId = roleRecord.id;

				let passwordHash: string | null = null;
				if (password) {
					passwordHash = await bcrypt.hash(password, 12);
				}

				// Batch operations for user update and role update
				const statements = [];
				if (passwordHash) {
					statements.push(
						db.prepare('UPDATE users SET email = ?, password_hash = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
						.bind(email, passwordHash, name || null, userId)
					);
				} else {
					statements.push(
						db.prepare('UPDATE users SET email = ?, name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
						.bind(email, name || null, userId) // Original query had role here, schema doesn't support it directly in users table
					);
				}
				
				// Corrected user update statement (remove direct role update from users table)
				statements.pop(); // Remove the incorrect statement
				if (passwordHash) {
					statements.push(
						db.prepare('UPDATE users SET email = ?, password_hash = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
						.bind(email, passwordHash, name || null, userId)
					);
				} else {
					statements.push(
						db.prepare('UPDATE users SET email = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
						.bind(email, name || null, userId)
					);
				}

				// Manage user_roles: Delete existing then insert new, or upsert if D1 supported easily.
				// Simpler: delete then insert for the role change.
				statements.push(db.prepare('DELETE FROM user_roles WHERE user_id = ?').bind(userId));
				statements.push(db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)').bind(userId, newRoleId));
				
				const batchResults = await db.batch(statements);

				// Check results of batch operations
				// The first result is for the user update. D1Result[]
				const userUpdateResult = batchResults[0];
				if (userUpdateResult.meta.changes === 0) {
					// This could mean user ID was not found.
					return { success: false, message: 'User not found or no user details changed.' };
				}
				
				// Further checks for role assignment can be added if necessary, e.g., if the insert failed.
				// batchResults[2] corresponds to the INSERT into user_roles.

				console.log(`User ${userId} updated.`);
				return { success: true, message: 'User updated successfully.' };

			} catch (error: any) {
				console.error(`Error updating user ${userId}:`, error);
				if (error.message?.includes('UNIQUE constraint failed: users.email')) {
					return { success: false, message: 'Email already exists for another user.' };
				}
				return { success: false, message: 'Failed to update user.' };
			}
		}
	}),

	// --- DELETE --- //
	deleteUser: defineAction({
		input: z.object({ id: z.number().int().positive() }),
		handler: async (
			input: { id: number },
			context: ActionAPIContext
		) => {
			const { id } = input;
			const db = context.locals.runtime.env.DB;
			try {
				// User deletion will cascade to user_roles due to FOREIGN KEY ON DELETE CASCADE
				const result = await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
				if (result.meta.changes === 0) {
					return { success: false, message: 'User not found.' };
				}
				console.log(`User ${id} deleted`);
				return { success: true, message: 'User deleted successfully.' };
			} catch (error) {
				console.error(`Error deleting user ${id}:`, error);
				return { success: false, message: 'Failed to delete user.' };
			}
		}
	})
}; 