import './css/Cat.css'
import PropTypes from "prop-types";

import catTemplate from './img/CatTemplate.png'

function Cat({eyes, hat, pattern}) {
  return (
    <div className='cat'>
      <img className='catTemplate' src={catTemplate}></img>
      <img className='catTemplate' src={`eyes/${eyes}.png`}></img>
      <img className='catTemplate' src={`hats/${hat}.png`}></img>
      <img className='catPelt' src={`pelts/${pattern}.jpg`} style={{}}></img>
    </div>
  )
}

export default Cat

Cat.propTypes = {
  eyes: PropTypes.string,
  hat: PropTypes.string,
  pattern: PropTypes.string,
}