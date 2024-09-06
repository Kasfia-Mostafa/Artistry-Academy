import FormComponent from "../../../components/form/FormComponent";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Button, Col, Flex } from "antd";
import FormSelect from "../../../components/form/FormSelect";
import { semesterOptions } from "../../../components/constants/semesters";
import { monthOptions } from "../../../components/constants/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicSemesterSchema } from "../../../Schema/academicManagement.schema";
import { toast } from "sonner";
import { useAddAcademicSemesterMutation } from "../../../redux/features/admin/academicManagementApi";
import { TResponse } from "../../../Types";

const currentYear = new Date().getFullYear();
const yearOptions = [0, 1, 2, 3, 4].map((number) => ({
  value: String(currentYear + number),
  label: String(currentYear + number),
}));

const CreateAcademicSemester = () => {
  const [addAcademicSemester] = useAddAcademicSemesterMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const name = semesterOptions[Number(data?.name) - 1].label;
    const semesterData = {
      name,
      code: data.name,
      year: data.year,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
    };
    try {
      const res = (await addAcademicSemester(semesterData)) as TResponse ;
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Semester created successfully", { id: toastId });
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="middle">
      <Col span={6}>
        <FormComponent
          onSubmit={onSubmit}
          resolver={zodResolver(academicSemesterSchema)}
        >
          <FormSelect label="Name" name="name" options={semesterOptions} />
          <FormSelect label="Year" name="year" options={yearOptions} />
          <FormSelect
            label="Start month"
            name="startMonth"
            options={monthOptions}
          />
          <FormSelect
            label="End month"
            name="endMonth"
            options={monthOptions}
          />
          <Button htmlType="submit">Submit</Button>
        </FormComponent>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;
