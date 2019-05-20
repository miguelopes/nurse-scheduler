module.exports = MockBase => class MockRivers extends MockBase {
  mocks () {
    return {
      route: '/rivers',
      responses: [
        {
          response: {
            type: 'json',
            body: '\
              {"chefes": [[0,1,3,2,1,3,2], [0,1,3,2,1,3,2], [0,1,3,2,1,3,2]],\
              "normais": [[0,1,3,2,1,3,2], [0,1,3,2,1,3,2]],\
              "burrasUm": [[0,1,3,2,1,3,2]],\
              "burrasDois": [[0,1,3,2,1,3,2], [0,1,3,2,1,3,2], [0,1,3,2,1,3,2]]\
            }'
          }
        }
      ]
    }
  }
}