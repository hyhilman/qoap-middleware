Feature: Publish and subcribe through a topic
  As an IoT developer
  In order to communicate with my "things"
  I want to subscribe and publish to topics

  Scenario: Receiving message from CoAP
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

   Scenario: Receiving message from CoAP with two applications
    Given client "A" subscribe to "foobar" via WEBSOCKET
    Given client "C" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET
    Then client "C" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: Receiving message from MQTT
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: Receiving message from MQTT with two applications
    Given client "A" subscribe to "foobar" via WEBSOCKET
    Given client "C" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET
    Then client "C" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: Receiving plain text message with pattern
    Given client "A" subscribe to "foo/*" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foo/bar" via MQTT
    Then client "A" should have received "{'foo':'bar'}" from "foo/bar" via WEBSOCKET