import { I18nOptions } from 'nestjs-i18n';
import { join } from 'path';
import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'en',
  fallbacks: {
    'en-*': 'en',
    'hi-*': 'hi',
  },
  loaderOptions: {
    // path: join(__dirname, '..', 'common/i18n/'),
    path: join(process.cwd(), 'src/common/i18n'),
    watch: true,
    includeSubfolders: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang', 'locale', 'l'] },
    AcceptLanguageResolver,
  ],
  logging: true,
};
