import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveNewsletterEmailApi, getNewsletterEmailsApi, sendNewsletterEmailApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";

const NewsletterEmail = () => {
  // const { token } = useSelector((store) => store.logininfo);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  // ✅ Fetch saved newsletter emails
  const fetchEmails = async () => {
    try {
      const response = await getNewsletterEmailsApi();
      setEmails(response.data.emails);
    } catch (error) {
      console.error("❌ Error fetching emails:", error);
    }
  };

  // ✅ Handle Form Submission (Save Newsletter)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      return toast.error("Title and content are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("emailimage", image);

    try {
      await saveNewsletterEmailApi(formData);
      toast.success("Newsletter email saved!");
      fetchEmails();
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      toast.error("Error saving email.");
    }
  };

  // ✅ Send Email to Subscribers (With Image)
  const handleSendEmail = async (id, emailImage) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      if (emailImage) {
        formData.append("emailimage", emailImage);
      }

      await sendNewsletterEmailApi(id, formData);
      toast.success("Newsletter sent to subscribers!");
    } catch (error) {
      toast.error("Error sending email.");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Newsletter Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="mb-3">
            <label>Content</label>
            <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div className="mb-3">
            <label>Upload Image</label>
            <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <button type="submit" className="btn btn-primary">Save Newsletter</button>
        </form>

        <hr />
        <h3>Saved Newsletters</h3>
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>{email.title}</strong>
              <button className="btn btn-success btn-sm ms-2" onClick={() => handleSendEmail(email.id, email.emailimage)}>Send</button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default NewsletterEmail;
