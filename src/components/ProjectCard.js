import premium from "@/assets/icons/premium.png";
import free from '@/assets/icons/free2.png'
import save from "@/assets/icons/save.png";
import heart from "@/assets/icons/heart.png";
import Icons from "./Icons";
import Link from "next/link";
import { addFavouriteItem, callViewProfileAPI, viewProfile } from "@/service/api";
import { useSelector } from "react-redux";
import { addedFavouriteItem } from "../../redux/app/features/projectsSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { handledownload } from "@/service/globalfunction";

const ProjectCard = ({  view_count, work_title, file_type,uuid,photo_url,project_type}) => {
  const router = useRouter();
  const { token } = useSelector((store) => store.logininfo.user);
  const handleviewcount = (event) => {
    if (event.target.tagName == "IMG"){
      event.preventDefault();
      return ;
    }
    callViewProfileAPI(uuid).then((res)=>{
        console.log("view",res.data)
      }
      ).catch((err)=>{
        console.log(err)
      })
  }
  const handleLike = () => {
    if(token){
    const requestuuid = { project_uuid:uuid };
    addFavouriteItem(requestuuid, token)
      .then((res) => {
        console.log(res);
        toast.success("Added to Favourite list", { position: "top-right" });
        dispatch(
          addedFavouriteItem(res.data.projects)
         )
      })
      .catch((err) => {
        console.log(err);
        if(err?.response?.status===401 || err?.response?.status===400){
        toast.error(`${err?.response?.data?.error}`);
        }
      
      });
    }
    else{
      router.push("/auth/login");
    }
  };
  return (
    <div className='project-day-card h-100'>
      <Link onClick={handleviewcount}  className="h-100" href={`/categories/view/${uuid}`}>
        <div className='project-day-card-image mb-3 position-relative'>
          
              <img src={photo_url} alt="project" className='w-100 img-fluid' />
          <div className='action-buttons-wrapper position-absolute bottom-0 end-0 d-inline-flex flex-column gap-1 pe-2 pb-2'>
            <button onClick={()=>handleLike()} className='border-0 bg-transparent p-0 shadow-none d-in'><img src={heart.src} className='border-0' alt="icon" /></button>
            <button onClick={()=>handledownload(uuid,token,router)} className='border-0 bg-transparent p-0 shadow-none'><img src={save.src} className='border-0' alt='icon' loading="lazy" /></button>
          </div>
        </div>
        <div className='project-day-card-description d-flex justify-content-between'>
          <p className='ps-3 work-title'>{work_title}</p>
          <div>
            <span className='badge bg-secondary text-white'>{file_type}</span>
            <div className='d-flex gap-1 mt-2 align-items-center'>
              <span><Icons.Eye /></span>
              <span className="text-grey">{view_count}</span>
            </div>
          </div>
        </div>
        <div className='text-end mt-2'>
        {project_type === "Gold" ? (
        <span style={{
          fontWeight: '500',
          fontSize: '14px', // Set the font size to the desired size
          color: '#e59710',
          backgroundColor: '#fcebce',
          padding: '8px 15px', // Adjust padding for consistency
          textTransform: 'uppercase',
          border: '0',
          display: 'inline-block',
        }}>
          Gold
        </span>
      ) : (
        <button style={{
          border: '0',
          padding: '8px 15px', // Adjust padding for consistency
          textTransform: 'uppercase',
          fontWeight: '500',
          color: '#10a308',
          backgroundColor: '#cefcd0',
        }}>
          Free
        </button>
      )}

        </div>
        <div className='project-day-card-link'>
          <p className='pe-2'>MORE DETAILS</p>
        </div>
      </Link>
    </div>
  );
}
export default ProjectCard;