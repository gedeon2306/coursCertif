// Header du cours individuel
const Header = ({ course }) => {
  return <h2>{course.name}</h2>
}

// Ligne unique de partie
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

// Liste dynamique des parties
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

// Total des exercices calculé avec reduce
const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return <strong>total of {total} exercises</strong>
}

// Composant Course pour un seul cours
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {/* Parcours du tableau des cours pour afficher chaque composant Course */}
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  )
}

export default App