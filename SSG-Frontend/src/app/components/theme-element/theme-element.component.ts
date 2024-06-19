import {Component, EventEmitter, Input, Output} from '@angular/core';
import { faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import {Theme, ThemeService} from '../../services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeModalComponent } from '../theme-modal/theme-modal.component';
import { NewThemeData } from '../../theme-selection/theme-selection.component';
import {ElementStyle, ElementStyleService} from "../../services/element-style.service";
import {StyleService} from "../../services/style.service";
import {Style} from "../../services/style.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-theme-element',
  standalone: true,
  imports: [FaIconComponent,CommonModule],
  templateUrl: './theme-element.component.html',
  styleUrl: './theme-element.component.css'
})
export class ThemeElementComponent {
  @Input() theme: Theme = {name:"Default",userName:"SSG",isPublic:true,id:-1};
  @Output() themeSelected: EventEmitter<Theme> = new EventEmitter<Theme>();
  protected backgroundColor: string = "white";
  protected background: string = "white";
  protected fontFamily: string = "Times New Roman";
  protected headerColor: string = "black";
  protected paragraphColor: string = "black";
  faCheck = faCheck;
  userName : string = "";
  faTrash = faTrash;
  faPen = faPen;

  constructor(private dialog: MatDialog,
              private themeService: ThemeService,
              private elementService: ElementStyleService,
              private styleService: StyleService){
  }

  ngOnInit() {
    const jwt = sessionStorage.getItem('jwt')?.replace("Bearer","");
    if(jwt === undefined){
      this.userName = "Not logged in";
      return;
    }
    const decodedJwt = jwtDecode(jwt);
    this.userName = (decodedJwt as any).preferred_username;

    this.elementService.getAllFromTheme(this.theme.id).subscribe(async (elementStyles: ElementStyle[]) => {
      this.backgroundColor = await this.findFirstValue(elementStyles, ['*', 'html', 'body'], 'background-color') ?? this.backgroundColor;
      this.background = await this.findFirstValue(elementStyles, ['*', 'html','body'], 'background') ?? this.background;
      this.fontFamily = await this.findFirstValue(elementStyles, ['*', 'body', 'p'], 'font-family') ?? this.fontFamily;
      this.headerColor = await this.findFirstValue(elementStyles, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '*', 'body', 'html'], 'color') ?? this.headerColor;
      this.paragraphColor = await this.findFirstValue(elementStyles, ['p', '*', 'body', 'html'], 'color') ?? this.paragraphColor;
    });
  }

  onThemeSelected(): void {
    this.themeSelected.emit(this.theme);
  }

  onThemeDeleted() : void{
    this.themeService.deleteTheme(this.theme.id).subscribe(()=>{
      document.location.reload();
    });
  }

  onThemePatch(){
    const dialogRef = this.dialog.open(ThemeModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result : NewThemeData) => {
      if (result === undefined) {
        return;
      }
      this.handleThemeEdit(result)
    });
  }

  handleThemeEdit(newTheme : NewThemeData){
    this.themeService.patchThemeName(this.theme.id,newTheme.name).subscribe();
    this.theme.name = newTheme.name;
    this.themeService.patchThemePublicity(this.theme.id,newTheme.isPublic).subscribe();
    this.theme.isPublic = newTheme.isPublic;
  }

  async findFirstValue(selectors: ElementStyle[], selectorsWanted: string[], property: string): Promise<string | null> {
    for (const selector of selectorsWanted) {
      const elementStyle: ElementStyle | undefined = selectors.find(s => s.selector.includes(selector));
      if (elementStyle !== undefined) {
        const styles: Style[] = await lastValueFrom(this.styleService.getAllStylesOfElementStyle(elementStyle.id));
        const style: Style | undefined = styles.find(s => s.property === property);
        if (style !== undefined) {
          return style.value;
        }
      }
    }
    return null;
  }
}
