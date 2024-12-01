import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'; 
import Button from '../components/ui/Button'; 
import Input from '../components/ui/Input'; 
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
    } else {
      setError("Not in database.");
    }
  };
  
  
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
       
          <Card className=" w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      
            <CardHeader className="text-xl font-semibold text-center mb-4">Your Log</CardHeader>
            <CardTitle className="text-2xl font-bold text-left mb-6">LOG IN</CardTitle>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
               
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error && "Email is required."}
                  className="mb-4"
                />

                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error && "Password is required."}
                  className="mb-6"
                />

                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                  Log In
                </Button>
              </form>
            </CardContent>

           
            <div className="fixed top-4 left-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-cyan-800 hover:bg-primary-200 rounded-lg"
            >
              <Home className="h-5 w-5" />
              <span className="hidden md:block">Home</span>
            </button>
    
            </div>
          </Card>
        </div>
     
    </>
  );
}

export default Login;
