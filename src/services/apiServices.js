import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

class ApiService {
  constructor(baseUrl) {
    this.client = new ApolloClient({
      uri: baseUrl,
      cache: new InMemoryCache(),
    });
  }

  /**
   * Ejecuta una consulta GraphQL usando Apollo Client
   * @param {DocumentNode} query - Consulta GraphQL (importada desde operations.js)
   * @param {Object} variables - Variables opcionales para la consulta
   * @returns {Promise<Object>} - Datos obtenidos de la consulta
   */
  async fetchData(query, variables = {}) {
    try {
      const { data } = await this.client.query({
        query,
        variables,
        fetchPolicy: 'network-only', // evita resultados en cache si es necesario
      });
      return data;
    } catch (error) {
      console.error('GraphQL query error:', error.message);
      return null;
    }
  }

  /**
   * Ejecuta una mutación GraphQL usando Apollo Client
   * @param {DocumentNode} mutation - Mutación GraphQL (importada desde operations.js)
   * @param {Object} variables - Variables para la mutación
   * @returns {Promise<Object>} - Resultado de la mutación
   */
  async postData(mutation, variables = {}) {
    try {
      const { data } = await this.client.mutate({
        mutation,
        variables,
      });
      return data;
    } catch (error) {
      console.error('GraphQL mutation error:', error.message);
      return null;
    }
  }
}

export default ApiService;
