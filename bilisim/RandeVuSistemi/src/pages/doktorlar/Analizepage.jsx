import DoktorStats from "../administration/home1";
import NavbarDoktor from "./navbar";

function DoktorlarAnalize() {
    const id=localStorage.getItem('doktorId')
  return (
    <div>
        <NavbarDoktor/>
        <DoktorStats idDoc={id}/>
    </div>
  );
}

export default DoktorlarAnalize;
