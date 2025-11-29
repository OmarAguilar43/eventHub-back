// src/resolvers.ts
import { PrismaClient } from "@prisma/client";

type Context = {
  prisma: PrismaClient;
};

export const resolvers = {
  Query: {
    usuarios: async (_: any, __: any, { prisma }: Context) => {
      return prisma.usuario.findMany();
    },
    eventos: async (_: any, __: any, { prisma }: Context) => {
      return prisma.evento.findMany({
        include: { organizador: true, inscripciones: true },
      });
    },
    evento: async (_: any, args: { id: string }, { prisma }: Context) => {
      return prisma.evento.findUnique({
        where: { id: Number(args.id) },
        include: { organizador: true, inscripciones: true },
      });
    },
    inscripcionesPorEvento: async (
      _: any,
      args: { eventoId: number },
      { prisma }: Context
    ) => {
      return prisma.inscripcion.findMany({
        where: { eventoId: args.eventoId },
        include: { evento: true, usuario: true },
      });
    },
  },

  Mutation: {
    registrarUsuario: async (
      _: any,
      args: { nombre: string; correo: string; password: string; rol: string },
      { prisma }: Context
    ) => {
      // OJO: en serio deberíamos hashear el password, pero para la materia
      // lo dejamos tal cual en passwordHash
      return prisma.usuario.create({
        data: {
          nombre: args.nombre,
          correo: args.correo,
          passwordHash: args.password,
          rol: args.rol as any,
        },
      });
    },

    crearEvento: async (
      _: any,
      args: {
        titulo: string;
        descripcion?: string | null;
        fechaInicio: string;
        fechaFin: string;
        cupo: number;
        organizadorId: number;
      },
      { prisma }: Context
    ) => {
      return prisma.evento.create({
        data: {
          titulo: args.titulo,
          descripcion: args.descripcion,
          fechaInicio: new Date(args.fechaInicio),
          fechaFin: new Date(args.fechaFin),
          cupo: args.cupo,
          estado: "ABIERTA",
          organizadorId: args.organizadorId,
        },
      });
    },

    inscribirAEvento: async (
      _: any,
      args: { eventoId: number; usuarioId: number },
      { prisma }: Context
    ) => {
      // Podrías validar cupo o duplicados más adelante
      return prisma.inscripcion.create({
        data: {
          eventoId: args.eventoId,
          usuarioId: args.usuarioId,
        },
        include: { evento: true, usuario: true },
      });
    },
  },

  // Resolvers de campos anidados (opcional pero más claro)
  Usuario: {
    eventosOrganizados: (parent: any, _args: any, { prisma }: Context) =>
      prisma.evento.findMany({
        where: { organizadorId: parent.id },
      }),
    inscripciones: (parent: any, _args: any, { prisma }: Context) =>
      prisma.inscripcion.findMany({
        where: { usuarioId: parent.id },
      }),
  },

  Evento: {
    organizador: (parent: any, _args: any, { prisma }: Context) =>
      prisma.usuario.findUnique({ where: { id: parent.organizadorId } }),
    inscripciones: (parent: any, _args: any, { prisma }: Context) =>
      prisma.inscripcion.findMany({
        where: { eventoId: parent.id },
      }),
  },

  Inscripcion: {
    evento: (parent: any, _args: any, { prisma }: Context) =>
      prisma.evento.findUnique({ where: { id: parent.eventoId } }),
    usuario: (parent: any, _args: any, { prisma }: Context) =>
      prisma.usuario.findUnique({ where: { id: parent.usuarioId } }),
  },

  Respuesta: {
    usuario: (parent: any, _args: any, { prisma }: Context) =>
      prisma.usuario.findUnique({ where: { id: parent.usuarioId } }),
  },
};
