import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  readonly label: string;
  /** Omit on the final item; it renders as the current page. */
  readonly to?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Shared editorial breadcrumb trail.
 *
 * The two brand surfaces previously carried near-identical `.bd-crumbs` and
 * `.bc-crumbs` markup and CSS. This component keeps one structure and one set
 * of `.px-crumb*` styles from the Stage 1 foundation.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="px-crumbs-nav" aria-label="Breadcrumb">
    <ol className="px-crumbs">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <li aria-hidden="true" className="px-crumb-sep">
                <ChevronRight size={12} />
              </li>
            )}
            <li>
              {item.to && !isCurrent ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
