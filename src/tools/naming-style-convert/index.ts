import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.naming-style-convert.title'),
  path: '/naming-style-convert',
  description: translate('tools.naming-style-convert.description'),
  keywords: ['naming', 'style', 'convert'],
  component: () => import('./naming-style-convert.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-12-23'),
});
