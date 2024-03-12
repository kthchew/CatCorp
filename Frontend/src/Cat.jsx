import './css/Cat.css'
import PropTypes from "prop-types";

import catTemplate from './img/CatTemplate.png'

function Cat({eyes, hat, pattern, patX, patY, x, y}) {
  return (
    <div className='cat' style={{bottom: y, left: x}}>
      <img className='catTemplate' src={catTemplate}></img>
      <img className='catTemplate' src={`eyes/${eyes}.png`}></img>
      <img className='catTemplate' src={`hats/${hat}.png`}></img>
      <img className='catPelt' 
        src={`pelts/${pattern}.jpg`} 
        style={{
          transform: `translate(calc((-100% + 64px) * ${patX}), calc((-100% + 64px) * ${patY}))`,
          maskPosition: `${patX * 100}% ${patY * 100}%`
        }}
      ></img>
    </div>
  )
}

export default Cat

Cat.propTypes = {
  eyes: PropTypes.string,
  hat: PropTypes.string,
  pattern: PropTypes.string,
  patX: PropTypes.number,
  patY: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
}