
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-large">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Join EduAttend</CardTitle>
            <CardDescription className="text-lg">
              Choose your role to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Link to="/signup/student" className="block">
              <Button variant="hero" className="w-full">
                <User className="mr-2 h-4 w-4" />
                I am a Student
              </Button>
            </Link>
            <Link to="/signup/faculty" className="block">
              <Button variant="premium" className="w-full">
                <GraduationCap className="mr-2 h-4 w-4" />
                I am a Faculty Member
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
