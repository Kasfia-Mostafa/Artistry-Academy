import { Button, Row } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { logout } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/form/FormComponent";
import FormInput from "../components/form/FormInput";
import { useAppDispatch } from "../redux/features/hooks";
import { TResponse } from "../Types";
import { useChangePasswordMutation } from "../redux/features/admin/userManagementAPi";

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    const res = (await changePassword(data)) as TResponse<any>;
    console.log(res?.data?.success);
    if (res?.data?.success) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <FormComponent onSubmit={onSubmit}>
        <FormInput type="text" name="oldPassword" label="Old Password" />
        <FormInput type="text" name="newPassword" label="New Password" />
        <Button htmlType="submit">Login</Button>
      </FormComponent>
    </Row>
  );
};

export default ChangePassword;
