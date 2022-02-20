import {
  InfoCircleFilled,
  TagOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  notification,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import { useCallback, useState } from 'react';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import EntriesList from '../features/EntriesList';
import EntryCategoryManager from '../features/EntryCategoryManager';
import EntryDetails from '../features/EntryDetails';
import EntryForm from '../features/EntryForm';

const { Title, Text } = Typography;

interface EntryCRUDProps {
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntryCRUD({ type }: EntryCRUDProps) {
  const { selected, removeEntries, query } = useCashFlow(type);
  const { xs } = useBreakpoint();

  const [editingEntry, setEditingEntry] = useState<number | undefined>(
    undefined
  );

  const [detailedEntry, setDetailedEntry] = useState<number | undefined>(
    undefined
  );

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  const openDetailsModal = useCallback(() => setShowDetailsModal(true), []);
  const closeDetailsModal = useCallback(() => setShowDetailsModal(false), []);

  return (
    <>
      <Modal
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        footer={null}
        title={'Gerenciar categorias'}
        destroyOnClose
      >
        <EntryCategoryManager type={type} />
      </Modal>
      <Modal
        visible={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        title={type === 'EXPENSE' ? 'Cadastrar despesa' : 'Cadastrar receita'}
        destroyOnClose
      >
        <EntryForm
          type={type}
          editingEntry={editingEntry}
          onSuccess={() => {
            closeFormModal();
            setEditingEntry(undefined);
            notification.success({
              message: `Entrada ${
                editingEntry ? 'atualizada' : 'cadastrada'
              } com sucesso`,
            });
          }}
        />
      </Modal>
      <Modal
        visible={showDetailsModal}
        onCancel={() => {
          closeDetailsModal();
        }}
        footer={null}
        title={
          type === 'EXPENSE' ? 'Detalhes da despesa' : 'Detalhes da receita'
        }
        destroyOnClose
      >
        {detailedEntry && <EntryDetails entryId={detailedEntry} />}
      </Modal>
      <Row
        justify={'space-between'}
        style={{
          marginBottom: 16,
          flexDirection: xs ? 'column-reverse' : 'row',
        }}
      >
        <Space style={{ ...(xs && { marginTop: 16 }) }}>
          <DoubleConfirm
            popConfirmTitle={`Remover ${
              selected.length > 1
                ? type === 'EXPENSE'
                  ? 'despesas selecionadas?'
                  : 'receitas selecionadas?'
                : type === 'EXPENSE'
                ? 'despesa selecionada?'
                : 'receita selecionada?'
            }`}
            modalTitle={
              type === 'EXPENSE' ? 'Remover despesas' : 'Remover receitas'
            }
            modalContent={
              type === 'EXPENSE'
                ? 'Remover uma ou mais despesas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.'
                : 'Remover uma ou mais receitas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.'
            }
            onConfirm={async () => {
              await removeEntries(selected as number[]);
            }}
            disabled={!selected.length}
          >
            <Button danger={xs} type={'primary'} disabled={!selected.length}>
              Remover
            </Button>
          </DoubleConfirm>
        </Space>
        <Space>
          <Button
            type={'primary'}
            icon={<TagOutlined />}
            onClick={openCategoryModal}
          >
            Categorias
          </Button>
          <Button
            type={'primary'}
            icon={<PlusCircleOutlined />}
            onClick={openFormModal}
          >
            Adicionar {type === 'EXPENSE' ? 'despesa' : 'receita'}
          </Button>
        </Space>
      </Row>
      <Space direction={'vertical'}>
        <Title level={3}>
          Recuperando {type === 'EXPENSE' ? 'despesas' : 'receitas'} do mês de{' '}
          {moment(query.yearMonth).format('MMMM \\d\\e YYYY')}
        </Title>
        <Space>
          <Text>
            É possível filtrar {type === 'EXPENSE' ? 'despesas' : 'receitas'}{' '}
            por mês
          </Text>
          <Tooltip placement={'right'} title={'Use a coluna data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>
      <Divider />
      <EntriesList
        type={type}
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onDetail={(id) => {
          setDetailedEntry(id);
          openDetailsModal();
        }}
      />
    </>
  );
}
