import { useState } from 'react'

// Composant pour un bouton
const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

// Ligne de tableau pour afficher une statistique
const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

// Composant qui calcule et affiche toutes les statistiques
const Statistics = (props) => {
  const { good, neutral, bad } = props
  const total = good + neutral + bad

  // Message si aucun avis n'a été donné
  if (total === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }

  // Calcul de la moyenne et du pourcentage de sous positifs
  const average = (good * 1 + neutral * 0 + bad * -1) / total
  const positivePercentage = (good / total) * 100

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positivePercentage + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

// Composant principal
const App = () => {
  // États pour stocker le nombre de clics
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Fonctions pour ajouter 1 à chaque clic
  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  // Rendu des boutons et des statistiques
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App