import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getSubscriberByIdApi, updateSubscriberApi } from "@/service/api"; // API Functions
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const EditSubscriber = () => {
  const { token } = useSelector((store) => store.logininfo);
  const router = useRouter();
  const { id } = router.query; // Get subscriber ID from URL
console.log("id: ", id);

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Subscriber Data
  useEffect(() => {
    if (id && token) {
      fetchSubscriberData();
    }
  }, [id, token]);

  const fetchSubscriberData = async () => {
    try {
      const res = await getSubscriberByIdApi(id, token);
      console.log("res: ", res);
      
      setForm({ name: res.data.subscriber.name, email: res.data.subscriber.email });
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching subscriber details!");
      router.push("/admin/newsletters/list-of-subscribers");
    }
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubscriberApi(id, form, token);
      toast.success("Subscriber updated successfully!");
      router.push("/admin/newsletters/list-of-subscribers"); // Redirect after update
    } catch (error) {
      toast.error("Error updating subscriber!");
    }
  };

  if (loading) return <p>Loading subscriber details...</p>;

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Edit Subscriber</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditSubscriber;
