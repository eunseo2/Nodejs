const Post = require('database/models/Post');

console.log(Post.getTableName());

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(Post.getTableName(), 'thumbnail', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
