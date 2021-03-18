const Sequelize = require('sequelize');
const db = require('database/db');

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
    thumbnail: Sequelize.STRING,
    fkUserId: { type: Sequelize.INTEGER, field: 'fk_user_id' },
    createAt: { type: Sequelize.DATE, fields: 'create_at' },
    updateAt: { type: Sequelize.DATE, field: 'updated_at' },
  }, // type은 front-end에게 줄때, db에 저장 컬럼명 field
  {
    indexs: [
      {
        fields: ['user_id'],
      },
    ],
  }
);

//모델 관계 설정

Post.associate = (models) => {
  Post.belongsTo(models.user, {
    foreignKey: 'fkUserId', // 외래키
    as: 'writer',
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  });
};

//post 테이블의 로우를 불러 올 때 users테이블의 로우를 가져옴. bdlongs To (post)N:1(user)

module.exports = Post;
