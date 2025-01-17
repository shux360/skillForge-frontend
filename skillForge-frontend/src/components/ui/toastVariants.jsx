import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useToast } from "@/components/hooks/use-toast"; // Import the useToast hook

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getJob = async (id) => {
  const token = await window.Clerk.session.getToken();

  const res = await fetch(`${backendUrl}/jobs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("res", res);
  const job = await res.json();
  return job;
};

const createJob = async (jobApplication) => {
  const token = await window.Clerk.session.getToken();

  const res = await fetch(`${backendUrl}/jobApplications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobApplication),
  });
  return res;
};

function JobPage() {
  const [job, setJob] = useState(null);
  const params = useParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const { toast } = useToast(); // Initialize the useToast hook

  useEffect(() => {
    getJob(params.id)
      .then((data) => {
        setJob(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch job details. Please try again.",
        });
      });
  }, [params, toast]);

  const [formData, setFormData] = useState({
    fullName: "",
    a1: "",
    a2: "",
    a3: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      const res = await createJob({
        fullName: formData.fullName,
        answers: [formData.a1, formData.a2, formData.a3],
        job: params.id,
        userId: user.id,
      });

      if (res.ok) {
        toast({
          variant: "success",
          title: "Success",
          description: "Job application submitted successfully!",
        });
        setFormData({
          fullName: "",
          a1: "",
          a2: "",
          a3: "",
        });
      } else {
        throw new Error("Failed to submit job application");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit job application. Please try again.",
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div>
      <div>
        <h2>{job?.title}</h2>
        <div className="flex items-center gap-x-4 mt-4">
          <div className="flex items-center gap-x-2">
            <Briefcase />
            <span>{job?.type}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <MapPin />
            <span>{job?.location}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 py-4">
        <p>{job?.description}</p>
      </div>

      <Separator />

      <form className="py-8 flex flex-col gap-y-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-4">
          <Label>Full Name</Label>
          <Input
            required
            value={formData.fullName}
            onChange={(event) =>
              setFormData({ ...formData, fullName: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-col gap-y-4">
            <Label>{job?.questions[0]}</Label>
            <Textarea
              required
              value={formData.a1}
              onChange={(event) =>
                setFormData({ ...formData, a1: event.target.value })
              }
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-y-4">
            <Label>{job?.questions[1]}</Label>
            <Textarea
              required
              value={formData.a2}
              onChange={(event) =>
                setFormData({ ...formData, a2: event.target.value })
              }
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-y-4">
            <Label>{job?.questions[2]}</Label>
            <Textarea
              required
              value={formData.a3}
              onChange={(event) =>
                setFormData({ ...formData, a3: event.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-x-4 items-center">
          <Button type="submit" className="bg-card text-card-foreground w-fit">
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFormData({
                fullName: "",
                a1: "",
                a2: "",
                a3: "",
              });
              toast({
                variant: "info",
                title: "Form Cleared",
                description: "The form has been cleared.",
              });
            }}
            className="w-fit"
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

export default JobPage;