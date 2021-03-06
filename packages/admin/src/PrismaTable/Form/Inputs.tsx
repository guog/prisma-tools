import React, { useContext, useRef, useState } from 'react';
import { Modal } from '@paljs/ui/Modal';
import { Button } from '@paljs/ui/Button';
import { Checkbox } from '@paljs/ui/Checkbox';
import { EvaIcon } from '@paljs/ui/Icon';
import { InputGroup } from '@paljs/ui/Input';
import Select from '@paljs/ui/Select';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import DatePicker from 'react-datepicker';
import styled, { css } from 'styled-components';
import { useLazyQuery } from '@apollo/client';

import { useEnum } from '../useSchema';
import { getDisplayName } from '../Table/utils';
import DynamicTable from '../dynamicTable';
import { queryDocument } from '../QueryDocument';
import { TableContext } from '../Context';
import { FormInputs } from '../../types';

const ReactQuill =
  typeof window !== 'undefined' ? require('react-quill') : <div />;

interface Option {
  value: any;
  label: any;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 4, 5, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    [{ script: 'sub' }, { script: 'super' }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ direction: 'rtl' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'script',
  'code',
  'color',
  'size',
  'blockquote',
  'list',
  'font',
  'background',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'code-block',
  'direction',
  'align',
];

const defaultInputs: Omit<FormInputs, 'Upload'> = {
  Default({ field, error, register, disabled }) {
    const options: any = {
      name: field.name,
      disabled,
      ref: register(field.required ? { required: true } : {}),
    };
    if (field.list) {
      options['type'] = 'text';
    } else {
      switch (field.type) {
        case 'Int':
          options['type'] = 'number';
          break;
        case 'Flout':
          options['type'] = 'number';
          options['step'] = 'any';
          break;
        case 'String':
          options['type'] = 'text';
          break;
      }
    }
    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <InputGroup status={error ? 'Danger' : 'Primary'} fullWidth>
              <input {...options} />
            </InputGroup>
          </Col>
        </Row>
        <span className="caption-2 status-Danger">
          {error ? field.title + ' is required' : ''}
        </span>
      </StyledCol>
    );
  },
  Editor({ field, value, error, register, setValue, disabled }) {
    React.useEffect(() => {
      register({ name: field.name, required: field.required });
    }, [register]);

    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <StyledReactQuillCol breakPoint={{ xs: 8 }}>
            <ReactQuill
              readOnly={disabled}
              theme="snow"
              modules={modules}
              formats={formats}
              defaultValue={value}
              onChange={(value: string) => setValue(field.name, value)}
            />
          </StyledReactQuillCol>
        </Row>
        <span className="caption-2 status-Danger">
          {error ? field.title + ' is required' : ''}
        </span>
      </StyledCol>
    );
  },
  Enum({ field, value, error, register, setValue, disabled }) {
    const [state, setState] = useState(value);
    const enumType = useEnum(field.type);

    React.useEffect(() => {
      register({ name: field.name, required: field.required });
    }, [register]);

    const options: Option[] = field.required
      ? []
      : [{ value: null, label: 'All' }];
    if (enumType) {
      options.push(
        ...enumType.fields.map((item) => ({ value: item, label: item })),
      );
    }
    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <Select
              disabled={disabled}
              status={error ? 'Danger' : 'Primary'}
              shape="SemiRound"
              value={options.find((option) => option.value === state)}
              onChange={(option: any) => {
                setState(option.value);
                setValue(field.name, option.value);
              }}
              options={options}
            />
          </Col>
        </Row>
        <span className="caption-2 status-Danger">
          {error ? field.title + ' is required' : ''}
        </span>
      </StyledCol>
    );
  },

  Object({ field, value, error, register, setValue, disabled }) {
    const {
      schema: { models },
    } = useContext(TableContext);
    const model = models.find((item) => item.id === field.type)!;
    const [modal, setModal] = useState(false);
    const [state, setSate] = useState(value);

    const [getData, { data, loading }] = useLazyQuery(
      queryDocument(models, field.type, true),
    );
    const result = data ? data[`findUnique${field.type}`] : {};

    if (
      state &&
      Object.keys(state).length > 0 &&
      !loading &&
      state[model.idField] !== result[model.idField]
    ) {
      getData({
        variables: {
          where: {
            [model.idField]: state[model.idField],
          },
        },
      });
    }

    React.useEffect(() => {
      register({ name: field.name, required: field.required });
    }, [register]);

    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Modal on={modal} toggle={() => setModal(!modal)}>
          <DynamicTable
            model={model.id}
            inEdit
            connect={Object.keys(state).length > 0 ? result : {}}
            onConnect={(_value) => {
              setSate(_value);
              setValue(field.name, _value);
              setModal(!modal);
            }}
          />
        </Modal>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <InputWithIcons fullWidth>
              <Button
                disabled={disabled}
                type="button"
                appearance="ghost"
                className="searchIcon"
                onClick={() => setModal(!modal)}
              >
                <EvaIcon name="search-outline" />
              </Button>
              {!field.required && (
                <Button
                  disabled={disabled}
                  type="button"
                  appearance="ghost"
                  status="Danger"
                  className="closeIcon"
                  onClick={() => {
                    setSate({});
                    setValue(field.name, null);
                  }}
                >
                  <EvaIcon name="close-circle-outline" />
                </Button>
              )}
              <input value={getDisplayName(state, model)} disabled />
            </InputWithIcons>
          </Col>
        </Row>
        <span className="caption-2 status-Danger">
          {error ? field.title + ' is required' : ''}
        </span>
      </StyledCol>
    );
  },
  Date({ field, value, error, register, setValue, disabled }) {
    const [state, setState] = useState(value ? new Date(value) : new Date());

    const onChangeHandler = (value: Date | [Date, Date]) => {
      if (!Array.isArray(value)) {
        setValue(field.name, value.toISOString());
        setState(value);
      }
    };

    React.useEffect(() => {
      register({ name: field.name, required: field.required });
    }, [register]);

    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <StyledInputGroup status={error ? 'Danger' : 'Primary'} fullWidth>
              <DatePicker
                disabled={disabled}
                selected={state}
                onChange={(date) => date && onChangeHandler(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </StyledInputGroup>
          </Col>
        </Row>
        <span className="caption-2 status-Danger">
          {error ? field.title + ' is required' : ''}
        </span>
      </StyledCol>
    );
  },
  Boolean({ field, value, register, setValue, disabled }) {
    const [state, setState] = useState(value);

    const onChangeHandler = (value: boolean) => {
      setValue(field.name, value);
      setState(value);
    };

    React.useEffect(() => {
      register({ name: field.name });
    }, [register]);

    return (
      <StyledCol breakPoint={{ xs: 12, lg: 6 }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">{field.title}</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <Checkbox
              disabled={disabled}
              status="Success"
              onChange={(value) => onChangeHandler(value)}
              checked={!!state}
            />
          </Col>
        </Row>
      </StyledCol>
    );
  },
};

export const Inputs: FormInputs = {
  ...defaultInputs,
  Upload: defaultInputs.Default,
};

const StyledInputGroup = styled(InputGroup)`
  li {
    color: black;
  }
`;

const StyledCol = styled(Col)`
  padding-bottom: 5px;
  padding-top: 5px;
  margin: 5px 0;
  border: 1px solid ${(props) => props.theme.backgroundBasicColor2};
`;

const InputWithIcons = styled(InputGroup)`
  .searchIcon {
    position: absolute;
    padding: 0;
    left: 5px;
    top: 10px;
  }
  .closeIcon {
    position: absolute;
    padding: 0;
    right: 5px;
    top: 10px;
  }
  input {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const StyledReactQuillCol = styled(Col)`
  ${({ theme }) => css`
    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      background-color: ${theme.inputPrimaryBackgroundColor};
      border: ${theme.inputPrimaryBorderColor} ${theme.inputBorderStyle}
        ${theme.inputBorderWidth};
      color: ${theme.inputPrimaryTextColor};
    }
    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.inputRectangleBorderRadius};
      border-bottom-right-radius: ${theme.inputRectangleBorderRadius};
    }
    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.inputRectangleBorderRadius};
      border-top-right-radius: ${theme.inputRectangleBorderRadius};
    }
    .ql-editor {
      max-height: 200px;
    }

    .ql-tooltip {
      z-index: 10;
    }
  `}
`;
