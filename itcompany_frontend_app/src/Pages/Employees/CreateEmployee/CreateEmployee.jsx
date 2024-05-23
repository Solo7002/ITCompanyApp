
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import "./CreateEmployee.css";

const CreateEmployee=()=>{

    const arr=['Alex','Bob','Tad','Anna','Ihor']
    return(
        <div>
            <SelectSearch options={arr} placeholder='Search Employee' />
        </div>
    )
}

export {CreateEmployee};