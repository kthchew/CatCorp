import './css/Cat.css'
import PropTypes from "prop-types";
import catTemplate from './img/CatTemplate.png'
import deskImg from "./img/Cat_desk/tempdesk.png"

function Cat({cat, x, y, z, viewCat}) {
  return (
      <div className='cat' style={{bottom: y, left: x}}>
        <img className='catButton'
        style={{zIndex: z + 100}}
        onClick={() => {
          viewCat(cat)
        }}
        src={catTemplate}
        ></img>

    <div className='cat' style={{zIndex: z}}>
      <img className='catPelt' 
        src={`pelts/${cat.pattern}.jpg`}
        style={{
          transform: `translate(calc((-100% + 64px) * ${cat.patX}), calc((-100% + 64px) * ${cat.patY}))`,
          maskPosition: `${cat.patX * 100}% ${cat.patY * 100}%`
        }}
      ></img>
      <img className='catTemplate' src={catTemplate}></img>
      <img className='catTemplate' src={`eyes/${cat.leftEye}.png`}></img>
      <img className='catTemplate' src={`eyes/${cat.rightEye}.png`}></img>
      <img className='catTemplate' src={`hats/${cat.hat}.png`}></img>
      <img src={deskImg} className='catTemplate'></img>
    </div>
          </div>
  )
}

export default Cat

Cat.propTypes = {
  cat: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  viewCat: PropTypes.func,
}