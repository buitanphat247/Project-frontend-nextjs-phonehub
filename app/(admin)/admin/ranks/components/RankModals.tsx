'use client';

import { Rank } from '../interface/IRank';
import RankDetailsModal from './RankDetailsModal';
import CreateRankModal from './CreateRankModal';
import EditRankModal from './EditRankModal';

interface RankModalsProps {
  selectedRank: Rank | null;
  modalVisible: boolean;
  createModalVisible: boolean;
  editModalVisible: boolean;
  onCloseViewModal: () => void;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCreateRank: (values: Partial<Rank>) => void;
  onEditRank: (values: Partial<Rank>) => void;
}

export default function RankModals({
  selectedRank,
  modalVisible,
  createModalVisible,
  editModalVisible,
  onCloseViewModal,
  onCloseCreateModal,
  onCloseEditModal,
  onCreateRank,
  onEditRank,
}: RankModalsProps) {
  return (
    <>
      <RankDetailsModal rank={selectedRank} visible={modalVisible} onClose={onCloseViewModal} />
      <CreateRankModal visible={createModalVisible} onClose={onCloseCreateModal} onSubmit={onCreateRank} />
      <EditRankModal rank={selectedRank} visible={editModalVisible} onClose={onCloseEditModal} onSubmit={onEditRank} />
    </>
  );
}

