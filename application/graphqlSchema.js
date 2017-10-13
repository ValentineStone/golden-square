const {buildSchema} = require('graphql');
  
// Construct a schema, using GraphQL schema language
if (module) module.exports = buildSchema(`
  type Customer {
    id: String
    name: String
    email: String
    age: Float
  }
  type Query {
    customers(id: String): [Customer],
    version: String
  }
`);

/*

// Hardcoded data
const customers = [
  {id:'1', name:'John Doe', email:'jdoe@gmail.com', age:35},
  {id:'2', name:'Steve Smith', email:'steve@gmail.com', age:25},
  {id:'3', name:'Sara Williams', email:'sara@gmail.com', age:32},
];


// Customer Type
const CustomerType = new GraphQLObjectType({
  name:'Customer',
  fields:() => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
});

// Root Query
const RootQuery= new GraphQLObjectType({
  name:'RootQueryType',
  fields:{
    customer:{
      type:CustomerType,
      args:{
        id:{type:GraphQLString}
      },
      resolve(parentValue, args){
        for(let i = 0;i < customers.length;i++){
          if(customers[i].id == args.id){
            return customers[i];
          }
        }
      }
    },
    customers:{
      type: new GraphQLList(CustomerType),
      args:{
        id:{type:GraphQLString}
      },
      resolve(parentValue, args){
        if (id in args)
          return [customers.find((customer) => customer.id === args.id)];
        else
          return customers;
      }
    }
  }
});
/*
// Mutations
const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addCustomer:{
      type:CustomerType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers', {
          name:args.name,
          email: args.email,
          age:args.age
        })
        .then(res => res.data);
      }
    },
    deleteCustomer:{
      type:CustomerType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return axios.delete('http://localhost:3000/customers/'+args.id)
        .then(res => res.data);
      }
    },
    editCustomer:{
      type:CustomerType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.patch('http://localhost:3000/customers/'+args.id, args)
        .then(res => res.data);
      }
    },
  }
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  //mutation
});
*/