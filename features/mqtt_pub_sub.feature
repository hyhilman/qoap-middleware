Feature: MQTT pub/sub
  As a MQTT developer
  In order to communicate with my "things"
  I want to subscribe and publish to topics

  Scenario: Receiving plain text message
    Given client "A" subscribe to "foobar" via MQTT
    When client "B" publishes "hello world" to "foobar" via MQTT
    Then client "A" should have received "hello world" from "foobar" via MQTT

  Scenario: Receiving JSON message
    Given client "A" subscribe to "foobar" via MQTT
    When client "A" publishes "[42,43]" to "foobar" via MQTT
    Then client "A" should have received "[42,43]" from "foobar" via MQTT

  Scenario: Receiving plain text message with pattern
    Given client "A" subscribe to "foo/*" via MQTT
    When client "B" publishes "hello world" to "foo/bar" via MQTT
    Then client "A" should have received "hello world" from "foo/bar" via MQTT