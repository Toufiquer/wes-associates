/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
import { withDB } from '@/app/api/utils/db';
import ThemeMode from './model';
import { IResponse } from '../../utils/utils';

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

export async function getThemeMode(): Promise<IResponse> {
  return withDB(async () => {
    const theme = await ThemeMode.findOne({});
    return formatResponse(theme || { theme_modes: ['custom'], current_theme_mode: 'custom' }, 'Theme fetched', 200);
  });
}

export async function updateThemeMode(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const data = await req.json();
    const updated = await ThemeMode.findOneAndUpdate({}, data, { upsert: true, new: true });
    return formatResponse(updated, 'Theme updated', 200);
  });
}
