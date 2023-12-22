
export class ListItem {
  item_id: String;
  item_text: String;
  
    public constructor(source: any) {
      if (typeof source === 'string') {
        this.item_id = this.item_text = source;
      }
      if (typeof source === 'object') {
        this.item_id = source.id;
        this.item_text = source.text;
      }
    }
  }