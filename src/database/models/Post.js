const Sequelize = require('sequelize');
const db = require('database/db');

const User = require('./User');

// define 모델에 대한 정의
const Post = db.define(
  'post', // post table
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, //기본키
      autoIncrement: true, 
    },
    title: Sequelize.STRING(100),
    text: Sequelize.TEXT,
    fk_user_id: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    indexs: [
      {
        fields: ['user_id'],
      },
    ],
  },
);

//모델 관계 설정 
Post.associate = () => {
  Post.belongsTo(User, {
    foreignKey: 'fk_user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  });
};

//post 테이블의 로우를 불러 올 때 users테이블의 로우를 가져옴. bdlongs To (post)N:1(user)

module.exports = Post;
