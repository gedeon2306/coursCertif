// En-tête : on déstructure directement "course" depuis les props
const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

// Composant pour une ligne unique (nom de la partie + nombre d'exercices)
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

// Content : parcourt le tableau "parts" avec .map()
const Content = ({ parts }) => {
  return (
    <div>
      {/* Chaque élément issu d'un .map() nécessite une prop "key" unique */}
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

// Composant englobant qui assemble l'en-tête et la liste
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      {/* On transmet uniquement le tableau "parts" au composant Content */}
      <Content parts={course.parts} />
    </div>
  )
}

// Composant racine contenant les données du cours
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
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
      }
    ]
  }

  return <Course course={course} />
}

export default App