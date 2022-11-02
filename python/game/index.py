import imp
import sys
import pygame
from settings import Setting
from ship import Ship
import game_function as gf
from pygame.sprite import Group
from game_status import GameStatus
from button import Button
from scoreboard import Scoreboard

def run_game():
  pygame.init()
  ai_settings = Setting()
  screen = pygame.display.set_mode((ai_settings.screen_width, ai_settings.screen_height))
  ship = Ship(ai_settings,screen)
  bullets = Group()
  status = GameStatus(ai_settings)

  scoreboard = Scoreboard(ai_settings, screen, status)

  aliens = Group()
  play_button = Button(ai_settings, screen, 'Play')
  gf.create_fleet(ai_settings, screen, ship, aliens)


  while True:
    gf.check_events(ai_settings, status, screen, ship, scoreboard, aliens, bullets, play_button)  
    if status.game_active:
      ship.update()
      # 删除消失的子弹
      gf.update_bullets(ai_settings, screen, ship, status, scoreboard, aliens, bullets)
      gf.update_aliens(ai_settings, status, screen, ship, scoreboard, aliens, bullets)
    gf.update_screen(ai_settings, screen, status, ship, bullets, aliens, play_button, scoreboard)
    
run_game()