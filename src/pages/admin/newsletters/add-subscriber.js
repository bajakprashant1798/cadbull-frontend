import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addSubscriberApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";

const AddSubscriber = () => {
  // const { token } = useSelector((store) => store.logininfo);
  
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await addSubscriberApi(data);
      toast.success("Subscriber added successfully!");
      reset();
      router.push("/admin/newsletters/list-of-subscribers");
    } catch (error) {
      toast.error("Error adding subscriber");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Add Subscriber</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="Enter email address"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddSubscriber;
