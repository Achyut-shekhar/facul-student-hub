import React, { useState, useEffect } from "react";
import { facultyAPI } from "@/services/api";
import {
  Plus,
  Users,
  Calendar,
  Play,
  Filter,
  Search,
  Trash2,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/enhanced-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAttendance } from "@/contexts/AttendanceContext";
import { Badge } from "@/components/ui/badge";
import ClassDetails from "@/components/ClassDetails";

const ClassCard = ({
  classItem,
  status,
  onViewDetails,
  onDelete,
  onEndSession,
  onStartSession,
}) => {
  return (
    <Card className="shadow-medium hover:shadow-large transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{classItem.name}</CardTitle>
            <CardDescription className="font-mono">
              Code: {classItem.joinCode}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {status && (
              <Badge
                variant={
                  status === "active"
                    ? "default"
                    : status === "ended"
                    ? "destructive"
                    : "secondary"
                }
              >
                {status === "ended" ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Ended
                  </span>
                ) : (
                  status
                )}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(classItem)}
              title="Delete Class"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{classItem.studentsCount} students</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{classItem.sessionsCount} sessions</span>
          </div>
        </div>

        {classItem.lastSession && (
          <p className="text-xs text-muted-foreground">
            Last session: {classItem.lastSession}
          </p>
        )}

        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            disabled={status === "active"}
            onClick={() => onStartSession(classItem)}
          >
            <Play className="h-4 w-4 mr-2" />
            {status === "active"
              ? "Session Active"
              : status === "ended"
              ? "Start New Session"
              : "Start Session"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(classItem)}
          >
            View Details
          </Button>
          {status !== "ended" && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onEndSession(classItem)}
            >
              End Session
            </Button>
          )}
        </div>
        {status === "ended" && (
          <div className="text-center text-green-600 font-semibold mt-2">
            Class Ended
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FacultyDashboard = () => {
  const { toast } = useToast();
  const {
    sessions,
    updateCounter,
    startSession,
    endSession,
    getSessionStatus,
  } = useAttendance();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);

  // Start session handler
  const handleStartSession = async (classItem) => {
    try {
      const session = await facultyAPI.startSession(classItem.id);
      startSession(classItem.id); // Keep local state in sync
      toast({
        title: "Session Started",
        description: `${classItem.name} session is now active.`,
      });
      navigate(`/attendance/${classItem.id}?sessionId=${session.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to start session",
        variant: "destructive",
      });
    }
  };

  // End session handler
  const handleEndSession = async (classItem) => {
    try {
      const activeSession = sessions[classItem.id];
      if (!activeSession) {
        throw new Error("No active session found");
      }
      await facultyAPI.endSession(classItem.id, activeSession.id);
      endSession(classItem.id); // Keep local state in sync
      toast({
        title: "Session Ended",
        description: `${classItem.name} session has been ended.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to end session",
        variant: "destructive",
      });
    }
  };

  const [newClass, setNewClass] = useState({ name: "", joinCode: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);



  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const apiClasses = await facultyAPI.getClasses();
        setClasses(apiClasses);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load classes",
          variant: "destructive",
        });
        setClasses([]);
      }
    };
    
    loadClasses();
  }, []);

  const handleCreateClass = async () => {
    if (!newClass.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a class name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdClass = await facultyAPI.createClass(newClass.name);
      setClasses([...classes, createdClass]);
      setNewClass({ name: "", joinCode: "" });
      setIsCreateDialogOpen(false);

      toast({
        title: "Class Created",
        description: `${newClass.name} has been created successfully. Join Code: ${createdClass.joinCode}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (classItem) => {
    setSelectedClass(classItem);
    setDetailsOpen(true);
  };

  // 🔹 Filtering logic
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Track ended sessions locally for demo
  const [endedClassIds, setEndedClassIds] = useState([]);

  const activeClasses = filteredClasses.filter(
    (cls) =>
      sessions[cls.id]?.status === "active" && !endedClassIds.includes(cls.id)
  );
  const endedClasses = filteredClasses.filter(
    (cls) =>
      sessions[cls.id]?.status === "ended" || endedClassIds.includes(cls.id)
  );
  const scheduledClasses = filteredClasses.filter(
    (cls) =>
      (!sessions[cls.id] ||
        (sessions[cls.id]?.status !== "active" &&
          sessions[cls.id]?.status !== "ended")) &&
      !endedClassIds.includes(cls.id)
  );

  // Delete class handler
  const handleDeleteClass = async (classItem) => {
    try {
      await facultyAPI.deleteClass(classItem.id);
      setClasses((prev) => prev.filter((cls) => cls.id !== classItem.id));
      toast({
        title: "Class Deleted",
        description: `${classItem.name} has been deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" key={updateCounter}>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Faculty Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your classes and attendance sessions
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="hero" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Class</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Add a new class to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    placeholder="e.g., Computer Science 101"
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Join Code (Optional)</Label>
                  <Input
                    id="joinCode"
                    placeholder="Leave empty to auto-generate"
                    value={newClass.joinCode}
                    onChange={(e) =>
                      setNewClass({ ...newClass, joinCode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleCreateClass}>
                  Create Class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* Active Sessions */}
        {activeClasses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  status="active"
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteClass}
                  onEndSession={handleEndSession}
                  onStartSession={handleStartSession}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ended Sessions */}
        {endedClasses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ended Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  status="ended"
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteClass}
                  onEndSession={handleEndSession}
                  onStartSession={handleStartSession}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Classes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {scheduledClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  status={getSessionStatus(classItem.id)}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteClass}
                  onEndSession={handleEndSession}
                  onStartSession={handleStartSession}
                />
              ))}
            </div>
          ) : (
            <p>No scheduled classes.</p>
          )}
        </div>

        {filteredClasses.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">
              Your search for "{searchTerm}" did not match any classes.
            </p>
          </div>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedClass && <ClassDetails classItem={selectedClass} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyDashboard;
