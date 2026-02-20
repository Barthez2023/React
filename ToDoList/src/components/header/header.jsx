import style from "./header.module.css"
import reactlogo from '../../assets/react.svg'
export const Header=()=>{
    return (
        <div className={style.container}>
            <div className={style.titlecontainer}>
                <img src={reactlogo} alt="logo" width={50} height={50} />
                <div>
                    <h1>To do List</h1>
                    <div className="color-gray">
                        <code>Eliminez le chaos ,suivez le flux</code>
                    </div>
                </div>
            </div>
            <code className="color-primary">
                V.1.0
            </code>

        </div>
    )
}