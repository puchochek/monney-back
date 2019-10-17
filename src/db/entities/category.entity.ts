import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DefaultNamingStrategy,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';

  import { Expence } from './expence.entity';
  import { AppUser } from './user.entity';

@Entity()
export class Category {

    @PrimaryColumn('uuid')
    public id: string;

    @ManyToOne(type => AppUser, user => user.categories)
    @Column({ nullable: true })
    public user: string;

    @OneToMany(type => Expence, expence => expence.category)
    public expences: Expence[];

    @Column({ nullable: true })
    public type: string;

    @Column({ nullable: true })
    public description: string;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;

}