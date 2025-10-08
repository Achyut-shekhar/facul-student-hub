import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { facultyAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ClassDetails = ({ classItem }) => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [dailyData, setDailyData] = useState(null);

  const selectedDate = date.toISOString().split("T")[0];

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await facultyAPI.getClassDetails(classItem.id);
        setClassDetails(data);
        // Find attendance for selected date
        const attendance =
          data.sessions?.find((s) => s.date === selectedDate)?.attendance ||
          null;
        setDailyData(attendance);
      } catch (error) {
        setError(error.message || "Failed to load class details");
        toast({
          title: "Error",
          description: error.message || "Failed to load class details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classItem.id, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center min-h-[300px]">{error}</div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {classItem.name} - Attendance Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex justify-center">
          <div className="max-w-xs">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Attendance for {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Present</p>
                      <p className="text-2xl font-bold text-green-700">
                        {dailyData.presentCount}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Absent</p>
                      <p className="text-2xl font-bold text-red-700">
                        {dailyData.absentCount}
                      </p>
                    </div>
                  </div>
                  {dailyData.absentCount > 0 && (
                    <div>
                      <h3 className="font-bold mt-4">Absentees:</h3>
                      <ul className="mt-2 space-y-1">
                        {dailyData.absentees.map((student) => (
                          <li
                            key={student.id}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <span className="font-mono">{student.rollNo}</span>
                            <span>-</span>
                            <span>{student.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No attendance data for this date.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
