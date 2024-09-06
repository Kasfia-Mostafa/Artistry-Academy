import { Form, Select } from "antd";
import { Controller } from "react-hook-form";

type TSelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
};

const FormSelect = ({ label, name, options }: TSelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item label={label}>
          <Select
            style={{ width: "100%" }}
            {...field}
            size="large"
            options={options}
          />
        {error && <small style={{color:"red"}}>{error.message}</small>}
        </Form.Item>
      )}
    />
  );
};

export default FormSelect;
