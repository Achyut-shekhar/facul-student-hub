import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNavigate } from "react-router-dom";

const studentsData = [
    { id: 1, rollNo: "2023001", name: "Aarav Sharma" },
    { id: 2, rollNo: "2023002", name: "Aditi Singh" },
    { id: 3, rollNo: "2023003", name: "Arjun Reddy" },
    { id: 4, rollNo: "2023004", name: "Diya Patel" },
    { id: 5, rollNo: "2023005", name: "Ishaan Gupta" },
    { id: 6, rollNo: "2023006", name: "Kavya Mishra" },
    { id: 7, rollNo: "2023007", name: "Mohammed Khan" },
    { id: 8, rollNo: "2023008", name: "Neha Verma" },
    { id: 9, rollNo: "2023009", name: "Rohan Joshi" },
    { id: 10, rollNo: "2023010", name: "Saanvi Desai" },
];

const ManualAttendance = ({ classId }) => {
  const [attended, setAttended] = useState([]);
  const { toast } = useToast();
  const { endSession } = useAttendance();
  const navigate = useNavigate();

  const handleCheckboxChange = (studentId) => {
    setAttended((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = () => {
    toast({
      title: "Attendance Submitted",
      description: `${attended.length} students marked as present.`,
    });
    endSession(classId);
    navigate('/faculty-dashboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Present</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsData.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    checked={attended.includes(student.id)}
                    onCheckedChange={() => handleCheckboxChange(student.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleSubmit} className="mt-4">Submit Attendance</Button>
      </CardContent>
    </Card>
  );
};

export default ManualAttendance;