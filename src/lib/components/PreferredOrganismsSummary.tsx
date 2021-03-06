import { Suspense } from 'react';
import { useLocation } from 'react-router';

import { Link, IconAlt } from '@veupathdb/wdk-client/lib/Components';
import { makeClassNameHelper } from '@veupathdb/wdk-client/lib/Utils/ComponentUtils';

import { NewOrganismsBanner } from './NewOrganismsBanner';
import { PreferredOrganismsToggle } from './PreferredOrganismsToggle';

import {
  useAvailableOrganisms,
  useDisplayName,
  useNewOrganisms,
  usePreferredOrganismsEnabledState,
  usePreferredOrganismsState,
  useSavePreferredOrganisms,
  useTogglePreferredOrganisms,
} from '../hooks/preferredOrganisms';

import './PreferredOrganismsSummary.scss';

const cx = makeClassNameHelper('PreferredOrganisms');

export function PreferredOrganismsSummary() {
  const [preferredOrganismsEnabled] = usePreferredOrganismsEnabledState();
  const togglePreferredOrganisms = useTogglePreferredOrganisms();

  return (
    <div className={cx()}>
      <div className={cx('--Summary')}>
        <Link className={cx('--Link')} to="/preferred-organisms">
          <IconAlt fa="gear" /> My Organism Preferences{' '}
          <Suspense fallback={null}>
            <PreferredOrganismsCount />
          </Suspense>
        </Link>
        <PreferredOrganismsToggle
          enabled={preferredOrganismsEnabled}
          onClick={togglePreferredOrganisms}
          label={
            <span>{preferredOrganismsEnabled ? 'enabled' : 'disabled'}</span>
          }
        />
      </div>
      <Suspense fallback={null}>
        <NewOrganismsBannerController />
      </Suspense>
    </div>
  );
}

function PreferredOrganismsCount() {
  const availableOrganisms = useAvailableOrganisms();
  const [preferredOrganisms] = usePreferredOrganismsState();

  return (
    <>
      ({preferredOrganisms.length} of {availableOrganisms.size})
    </>
  );
}

function NewOrganismsBannerController() {
  const newOrganisms = useNewOrganisms();
  const displayName = useDisplayName();

  const [preferredOrganisms] = usePreferredOrganismsState();
  const onDismiss = useSavePreferredOrganisms(preferredOrganisms);

  const { pathname } = useLocation();

  const newOrganismCount = newOrganisms.size;

  return newOrganismCount === 0 ||
    pathname.startsWith('/preferred-organisms') ? null : (
    <NewOrganismsBanner
      newOrganismCount={newOrganismCount}
      displayName={displayName}
      onDismiss={onDismiss}
    />
  );
}
