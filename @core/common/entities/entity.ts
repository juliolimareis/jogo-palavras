export type ID = string;

export type EntityProps = {
  id?: ID | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export default abstract class Entity {
  id: ID;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(props?: EntityProps){
    this.id = props?.id ?? "";

    if(props?.createdAt){
      this.createdAt = props.createdAt;
    }

    if(props?.updatedAt){
      this.updatedAt = props.updatedAt;
    }else{
      this.updatedAt = null;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJson(){
    const json = {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as EntityProps;

    if(this.id){
      json.id = this.id;
    }

    return json;
  }

  abstract toString(): string;
}