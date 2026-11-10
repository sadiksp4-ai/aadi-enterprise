'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  badge?: string | number;
  /** Accessible name override (e.g. including the badge count). */
  ariaLabel?: string;
}

export interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  /**
   * Replace-mode: when provided it replaces the default strip classes
   * entirely (site adapter escape hatch).
   */
  tabsContainerClassName?: string;
  /** Replace-mode classes for each tab button. */
  tabClassName?: string;
  /** Extra classes merged onto the active tab (e.g. a state class). */
  activeTabClassName?: string;
  /** Replace-mode classes for the sliding indicator. */
  indicatorClassName?: string;
  /** Replace-mode classes for the tab badge. */
  badgeClassName?: string;
  /** Renders the strip with tablist semantics (role, aria-selected). */
  tablistAria?: { label: string; controls?: string };
  renderContent?: boolean;
  layoutId?: string;
  variant?: 'default' | 'glass' | 'pill';
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className,
  tabsContainerClassName,
  tabClassName,
  activeTabClassName,
  indicatorClassName,
  badgeClassName,
  tablistAria,
  renderContent = true,
  layoutId: customLayoutId,
  variant = 'default',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const uniqueId = React.useId();
  const indicatorLayoutId = customLayoutId || `active-tab-indicator-${uniqueId}`;

  React.useEffect(() => {
    if (defaultTab && controlledActiveTab === undefined) {
      setInternalActiveTab(defaultTab);
    }
  }, [defaultTab, controlledActiveTab]);

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const currentTabObj = tabs.find((t) => t.id === activeTab);
  const isGlass = variant === 'glass' || variant === 'pill';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        role={tablistAria ? 'tablist' : undefined}
        aria-label={tablistAria?.label}
        className={
          tabsContainerClassName ??
          cn(
            'flex items-center gap-1 self-start select-none',
            isGlass
              ? 'p-1 rounded-full bg-surface-raised backdrop-blur-xl border border-border dark:bg-[#0E0E0E] dark:border-[#1F1F1F]'
              : 'p-1 rounded-lg bg-surface-raised border border-border dark:bg-[#0E0E0E] dark:border-[#1F1F1F]'
          )
        }
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              role={tablistAria ? 'tab' : undefined}
              aria-selected={tablistAria ? isActive : undefined}
              aria-controls={tablistAria?.controls}
              aria-label={tab.ariaLabel}
              className={cn(
                tabClassName ??
                  cn(
                    'relative text-xs sm:text-sm font-medium transition-colors focus-ring select-none flex items-center gap-2 cursor-pointer',
                    isGlass ? 'px-4 py-1.5 rounded-full' : 'px-3.5 py-1.5 rounded-md',
                    isActive
                      ? 'text-text-primary font-medium dark:text-[#FAFAFA]'
                      : 'text-text-muted hover:text-text-secondary dark:text-[#6B6B6B] dark:hover:text-[#A1A1A1]'
                  ),
                isActive && activeTabClassName
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={indicatorLayoutId}
                  className={cn(
                    indicatorClassName ??
                      cn(
                        'absolute inset-0 shadow-xs',
                        isGlass
                          ? 'rounded-full bg-surface border border-border-hover dark:bg-[#141414] dark:border-[#1F1F1F]'
                          : 'rounded-md bg-surface border border-border-hover dark:bg-[#141414] dark:border-[#1F1F1F]'
                      )
                  )}
                  transition={motionTransitions.springMorph}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon && <span>{tab.icon}</span>}
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={
                      badgeClassName ??
                      'px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-hover border border-border text-text-secondary dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]'
                    }
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {renderContent && (
        <div className="relative min-h-[60px]">
          <AnimatePresence mode="wait">
            {currentTabObj?.content && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={motionTransitions.springGentle}
                className="text-sm text-text-secondary dark:text-[#A1A1A1]"
              >
                {currentTabObj.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
