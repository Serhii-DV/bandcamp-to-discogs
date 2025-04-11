import { B2DIconComponent } from '../popup/components/icon';
import { isFunction } from './utils';

interface CreateIconLinkParams {
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent) => any;
  title?: string;
  iconDefault: string;
  iconOnClick?: string;
  iconOnClickTimeout?: number;
}

export const createIconLink = ({
  className = 'icon-link',
  href = '#',
  onClick,
  title = '',
  iconDefault,
  iconOnClick,
  iconOnClickTimeout = 3000
}: CreateIconLinkParams): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.classList.add(className);
  link.title = title;
  link.href = href;
  link.target = '_blank';
  link.innerHTML = `<b2d-icon name="${iconDefault}"></b2d-icon>`;

  if (onClick && isFunction(onClick)) {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const eventReturn = onClick(e);

      if (iconOnClick) {
        const icon = link.querySelector('b2d-icon');
        if (icon instanceof B2DIconComponent) {
          icon.setIcon(iconOnClick);
          setTimeout(() => {
            icon.setIcon(iconDefault);
          }, iconOnClickTimeout);
        }
      }

      return eventReturn;
    });
  }

  return link;
};
