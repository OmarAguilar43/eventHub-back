// src/schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  enum Rol {
    ADMIN
    ASISTENTE
    ORGANIZADOR
    PONENTE
  }

  enum EstadoEvento {
    ABIERTA
    CERRADA
  }

  type Usuario {
    id: ID!
    nombre: String!
    correo: String!
    rol: Rol!
    fechaRegistro: String!
    eventosOrganizados: [Evento!]!
    inscripciones: [Inscripcion!]!
  }

  type Evento {
    id: ID!
    titulo: String!
    descripcion: String
    fechaInicio: String!
    fechaFin: String!
    cupo: Int!
    estado: EstadoEvento!
    organizador: Usuario!
    inscripciones: [Inscripcion!]!
  }

  type Inscripcion {
    id: ID!
    evento: Evento!
    usuario: Usuario!
  }

  type Respuesta {
    id: ID!
    usuario: Usuario!
    valor: Int
    comentario: String
  }

  type Query {
    usuarios: [Usuario!]!
    eventos: [Evento!]!
    evento(id: ID!): Evento
    inscripcionesPorEvento(eventoId: ID!): [Inscripcion!]!
  }

  type Mutation {
    registrarUsuario(
      nombre: String!
      correo: String!
      password: String!
      rol: Rol!
    ): Usuario!

    crearEvento(
      titulo: String!
      descripcion: String
      fechaInicio: String!
      fechaFin: String!
      cupo: Int!
      organizadorId: Int!
    ): Evento!

    inscribirAEvento(
      eventoId: Int!
      usuarioId: Int!
    ): Inscripcion!
  }
`;
