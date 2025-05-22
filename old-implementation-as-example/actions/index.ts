import { auth } from './auth';
import { users } from './users';
import { categories } from './categories';
import { podcasts } from './podcasts';
import { roles } from './roles';
import { youtubeChannels } from './youtubeChannels';
import { youtubePlaylists } from './youtubePlaylists';
import { series } from './series';
import { externalTasks } from './externalTasks';

export const server = {
  auth,
  users,
  roles,
  categories,
  series,
  podcasts,
  youtubeChannels,
  youtubePlaylists,
  externalTasks,
};