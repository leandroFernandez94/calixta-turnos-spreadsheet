import bookServices from "./api/bookServices"
import getServiceDays from "./api/getServiceDays"
import getServices from "./api/getServices"

export default function Home() {
  return (
    <>
      <h1>
        Agendar turno
      </h1>
      <section id="services">

      </section>
    </>
  )
}

export async function getStaticProps() {
  const data = await bookServices('Esteban', 'Turnos dia 14/08', ['2','3'])
  return {
    props: data,
    revalidate: 10
  }
}
