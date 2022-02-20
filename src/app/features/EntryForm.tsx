import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Space,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { CashFlow, CashFlowService } from 'vitorpmaringolo-sdk';
import CurrencyInput from '../components/CurrencyInput';
import { useForm } from 'antd/lib/form/Form';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import useCashFlow from '../../core/hooks/useCashFlow';

type EntryFormSubmit = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

interface EntryFormProps {
  type: 'EXPENSE' | 'REVENUE';
  onSuccess: () => any;
  editingEntry?: number | undefined;
}

export default function EntryForm({
  type,
  onSuccess,
  editingEntry,
}: EntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { revenues, expenses, fetching, fetchCategories } =
    useEntriesCategories();

  const {
    createEntry,
    fetching: fetchingEntries,
    updateEntry,
  } = useCashFlow(type);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (editingEntry) {
      setLoading(true);
      CashFlowService.getExistingEntry(editingEntry)
        .then((entry) => ({
          ...entry,
          transactedOn: moment(entry.transactedOn),
        }))
        .then(form.setFieldsValue)
        .finally(() => setLoading(false));
    }
  }, [editingEntry, form]);

  const categories = useMemo(
    () => (type === 'EXPENSE' ? expenses : revenues),
    [expenses, revenues, type]
  );

  const handleFormSubmit = useCallback(
    async (form: EntryFormSubmit) => {
      const newEntryDTO: CashFlow.EntryInput = {
        ...form,
        transactedOn: form.transactedOn.format('YYYY-MM-DD'),
        type,
      };

      editingEntry
        ? await updateEntry(editingEntry, newEntryDTO)
        : await createEntry(newEntryDTO);
      onSuccess();
    },
    [type, editingEntry, updateEntry, createEntry, onSuccess]
  );

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <Form form={form} layout={'vertical'} onFinish={handleFormSubmit}>
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label={'Descrição'}
            name={'description'}
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <Input placeholder={'E.g.: Pagamento da AWS'} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            label={'Categoria'}
            name={['category', 'id']}
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <Select loading={fetching} placeholder={'Selecione uma categoria'}>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={'Montante'}
            name={'amount'}
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <CurrencyInput
              defaultValue={'R$ 0,00'}
              onChange={(_, value) =>
                form.setFieldsValue({
                  amount: value,
                })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={type === 'EXPENSE' ? 'Data da saída' : 'Data da entrada'}
            name={'transactedOn'}
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <DatePicker
              format={'DD/MM/YYYY'}
              style={{ width: '100%' }}
              disabledDate={(date) => {
                return date.isAfter(moment());
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row justify={'end'}>
        <Space>
          <Button>Cancelar</Button>
          <Button
            loading={fetchingEntries}
            type={'primary'}
            htmlType={'submit'}
          >
            {editingEntry ? 'Atualizar' : 'Cadastrar'}{' '}
            {type === 'EXPENSE' ? 'despesa' : 'receita'}
          </Button>
        </Space>
      </Row>
    </Form>
  );
}
