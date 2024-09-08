import { Button, Col, Flex } from 'antd';
import { useState } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import FormComponent from '../../../components/form/FormComponent';
import FormInput from '../../../components/form/FormInput';
import { useGetAcademicFacultiesQuery } from '../../../redux/features/admin/academicManagementApi';
import FormSelectWithWatch from '../../../components/form/FormSelectWithWatch';

const OfferCourse = () => {
  const [id, setId] = useState('');

  console.log('Inside parent component', id);

  const { data: academicFacultyData } = useGetAcademicFacultiesQuery(undefined);

  const academicSemesterOptions = academicFacultyData?.data?.map((item:any) => ({
    value: item._id,
    label: item.name,
  }));

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <FormComponent onSubmit={onSubmit}>
          <FormSelectWithWatch
            onValueChange={setId}
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
          />
          <FormInput disabled={!id} type="text" name="test" label="Test" />
          <Button htmlType="submit">Submit</Button>
        </FormComponent>
      </Col>
    </Flex>
  );
};

export default OfferCourse;