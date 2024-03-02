import { } from 'react'
import PropTypes from 'prop-types'

export default function Rewards({ courses, userData }) {
  const newCompletions = courses.map((c) => {
    c[2].filter((a) => {
      a.length > 3 && Date.parse(a[4]) > userData.lastLogin
    })
  })
  console.log(newCompletions)

  // return (
  //   newCompletions.map((c) => {
  //     c ? c.map((a) => {return <div key={a}>hi</div>}) : {}
  //   })
  // )

  return (
    courses.map((c) => {
      return (
        c[2].map((a) => {
          return (
            a.length > 3 && Date.parse(a[4]) > userData.lastLogin
              ? (
                <div>
                  {a[1]}
                  {' '}
                  -
                  {' '}
                  {a[0]}
                </div>
                )
              : <></>
          )
        }))
    })
  )
}

Rewards.propTypes = {
  courses: PropTypes.object,
  userData: PropTypes.object,
}
