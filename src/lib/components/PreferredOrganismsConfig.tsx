import { useMemo, useState } from 'react';

import { noop } from 'lodash';

import { CheckboxTree } from '@veupathdb/wdk-client/lib/Components';
import { makeClassNameHelper } from '@veupathdb/wdk-client/lib/Utils/ComponentUtils';
import { makeSearchHelpText } from '@veupathdb/wdk-client/lib/Utils/SearchUtils';
import { Node } from '@veupathdb/wdk-client/lib/Utils/TreeUtils';
import { TreeBoxVocabNode } from '@veupathdb/wdk-client/lib/Utils/WdkModel';

import {
  useOrganismSearchPredicate,
  useRenderOrganismNode,
} from '../hooks/referenceStrains';

import {
  getNodeChildren,
  getNodeId,
  makeInitialPreviewExpansion,
  makePreviewTree,
} from '../utils/configTrees';

import './PreferredOrganismsConfig.scss';

const cx = makeClassNameHelper('PreferredOrganismsConfig');

interface Props {
  availableOrganisms: string[];
  configSelection: string[];
  organismTree: Node<TreeBoxVocabNode>;
  projectId: string;
  referenceStrains: Set<string>;
  setConfigSelection: (newPreferredOrganisms: string[]) => void;
}

export function PreferredOrganismsConfig({
  availableOrganisms,
  configSelection,
  organismTree,
  projectId,
  referenceStrains,
  setConfigSelection,
}: Props) {
  const renderNode = useRenderOrganismNode(referenceStrains, true);

  const [configFilterTerm, setConfigFilterTerm] = useState('');
  const [configExpansion, setConfigExpansion] = useState<string[]>([]);
  const configSearchPredicate = useOrganismSearchPredicate(
    referenceStrains,
    true
  );

  const previewExpansion = useMemo(
    () => makeInitialPreviewExpansion(organismTree),
    [organismTree]
  );
  const previewTree = useMemo(
    () => makePreviewTree(organismTree, configSelection),
    [organismTree, configSelection]
  );

  return (
    <div className={cx()}>
      <h1>Configure My Organisms</h1>
      <p className={cx('--Instructions')}>
        Set your <span className={cx('--InlineTitle')}>My Organisms</span> list
        to limit the organisms you see throughout {projectId}.
      </p>
      <div className={cx('--Main')}>
        <div className={cx('--Selections')}>
          <h2>Choose organisms to keep</h2>
          <CheckboxTree<TreeBoxVocabNode>
            tree={organismTree}
            getNodeId={getNodeId}
            getNodeChildren={getNodeChildren}
            isSearchable
            searchTerm={configFilterTerm}
            onSearchTermChange={setConfigFilterTerm}
            searchPredicate={configSearchPredicate}
            searchBoxHelp={makeSearchHelpText('the list below')}
            searchBoxPlaceholder="Type a taxonomic name"
            renderNode={renderNode}
            expandedList={configExpansion}
            onExpansionChange={setConfigExpansion}
            shouldExpandDescendantsWithOneChild
            isSelectable
            selectedList={configSelection}
            onSelectionChange={setConfigSelection}
            linksPosition={CheckboxTree.LinkPlacement.Both}
          />
        </div>
        <div className={cx('--Preview')}>
          <h2>
            Preview of <span className={cx('--InlineTitle')}>My Organisms</span>{' '}
            (
            <span
              className={cx(
                '--SelectionCount',
                configSelection.length === 0 && 'empty'
              )}
            >
              {configSelection.length}
            </span>{' '}
            of {availableOrganisms.length})
          </h2>
          <div className={cx('--PreviewInstructions')}>
            {projectId} will restrict the organisms it displays, throughout the
            site, to those you have chosen, as shown below.
          </div>
          {configSelection.length === 0 ? (
            <div className={cx('--NoPreferencesSelected')}>
              Please select at least one organism
            </div>
          ) : (
            <CheckboxTree<TreeBoxVocabNode>
              tree={previewTree}
              getNodeId={getNodeId}
              getNodeChildren={getNodeChildren}
              renderNode={renderNode}
              expandedList={previewExpansion}
              onExpansionChange={noop}
              shouldExpandDescendantsWithOneChild
              linksPosition={CheckboxTree.LinkPlacement.None}
            />
          )}
        </div>
      </div>
    </div>
  );
}
