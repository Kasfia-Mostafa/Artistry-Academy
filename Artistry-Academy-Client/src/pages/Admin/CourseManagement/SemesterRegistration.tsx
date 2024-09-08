import { toast } from "sonner";
import { Button, Col, Flex } from "antd";
import FormComponent from "../../../components/form/FormComponent";
import { FieldValues, SubmitHandler } from "react-hook-form";
import FormSelect from "../../../components/form/FormSelect";
import { semesterStatusOptions } from "../../../components/constants/semesters";
import { useGetAllSemestersQuery } from "../../../redux/features/admin/academicManagementApi";
import FormDatePicker from "../../../components/form/FormDatePicker";
import FormInput from "../../../components/form/FormInput";
import { useAddRegisteredSemesterMutation } from "../../../redux/features/admin/courseManagementApi";
import { TResponse } from "../../../Types";

const SemesterRegistration = () => {
  const [addSemester] = useAddRegisteredSemesterMutation();
  const { data: academicSemester } = useGetAllSemestersQuery([
    { name: "sort", value: "year" },
  ]);

  const academicSemesterOptions = academicSemester?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} ${item.year}`,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const semesterData = {
      ...data,
      minCredit: Number(data.minCredit),
      maxCredit: Number(data.maxCredit),
    };
    // console.log(semesterData);
    try {
      const res = (await addSemester(semesterData)) as TResponse<any>;
      // console.log(res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Semester created", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="middle">
      <Col span={6}>
        <FormComponent onSubmit={onSubmit}>
          <FormSelect
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
          />

          <FormSelect
            name="status"
            label="Status"
            options={semesterStatusOptions}
          />
          <FormDatePicker name="startDate" label="Start Date" />
          <FormDatePicker name="endDate" label="End Date" />
          <FormInput type="text" name="minCredit" label="Min Credit" />
          <FormInput type="text" name="maxCredit" label="Max Credit" />

          <Button htmlType="submit">Submit</Button>
        </FormComponent>
      </Col>
    </Flex>
  );
};

export default SemesterRegistration;
